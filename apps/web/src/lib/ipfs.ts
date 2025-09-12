// Утилиты для работы с IPFS
export class IPFSService {
  private static readonly PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  private static readonly PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  private static readonly PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

  /**
   * Загружает файл в IPFS через Pinata
   */
  static async uploadFile(file: File): Promise<string> {
    if (!this.PINATA_API_KEY || !this.PINATA_SECRET_KEY) {
      throw new Error('IPFS credentials not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.PINATA_API_KEY,
          'pinata_secret_api_key': this.PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Загружает JSON метаданные в IPFS
   */
  static async uploadJSON(data: object): Promise<string> {
    if (!this.PINATA_API_KEY || !this.PINATA_SECRET_KEY) {
      throw new Error('IPFS credentials not configured');
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.PINATA_API_KEY,
          'pinata_secret_api_key': this.PINATA_SECRET_KEY,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: 'NFT Metadata',
            keyvalues: {
              type: 'metadata',
              uploadedAt: new Date().toISOString(),
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`IPFS JSON upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Получает URL для доступа к файлу в IPFS
   */
  static getIPFSUrl(hash: string): string {
    return `${this.PINATA_GATEWAY}${hash}`;
  }
}