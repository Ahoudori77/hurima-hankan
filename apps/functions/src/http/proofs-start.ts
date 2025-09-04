import { BlobServiceClient, BlobSASPermissions, SASProtocol, generateBlobSASQueryParameters } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const account = process.env.STORAGE_ACCOUNT_NAME!;
const containerName = process.env.STORAGE_CONTAINER_PROOFS ?? "proofs";

const blobService = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

export async function issueUploadSas(orderId: string, blobName: string) {
  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000);

  const udk = await blobService.getUserDelegationKey(startsOn, expiresOn);

  const sas = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("cw"), // create + write
    startsOn,
    expiresOn,
    protocol: SASProtocol.Https,                 // 明示的にHTTPSのみ
  }, udk, account).toString();

  return {
    url: `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sas}`,
    blob: `${containerName}/${blobName}`,
    expires_in: 15 * 60,
  };
}
