// 例: apps/functions/src/http/orders-proofs-start.ts の中で
import { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const account = process.env.STORAGE_ACCOUNT_NAME!;       // 例: stproofsfrema0dev
const containerName = process.env.STORAGE_CONTAINER_PROOFS || "proofs";

const blobService = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

export async function issueUploadSas(orderId: string, blobName: string) {
  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000);

  // User Delegation Key を取得
  const udk = await blobService.getUserDelegationKey(startsOn, expiresOn);

  const sas = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("cw"), // create + write
    startsOn,
    expiresOn,
  }, udk, account).toString();

  const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sas}`;
  return { url, blob: `${containerName}/${blobName}`, expires_in: 15 * 60 };
}
