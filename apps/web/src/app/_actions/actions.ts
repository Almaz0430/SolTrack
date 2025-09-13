'use server';

async function pinFileToIPFS(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to pin file to IPFS: ${errorData.error.reason}`);
  }

  const data = await response.json();
  return data.IpfsHash;
}

async function pinJSONToIPFS(json: object) {
  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: JSON.stringify({ pinataContent: json }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to pin JSON to IPFS: ${errorData.error.reason}`);
  }

  const data = await response.json();
  return data.IpfsHash;
}

export async function uploadToPinata(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const artist = formData.get("artist") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;
    const coverFile = formData.get("cover") as File;
    const trackFile = formData.get("track") as File;

    if (!name || !artist || !genre || !description || !coverFile || !trackFile) {
      throw new Error("Missing required form fields");
    }

    const coverIpfsHash = await pinFileToIPFS(coverFile);
    const trackIpfsHash = await pinFileToIPFS(trackFile);

    const metadata = {
      name,
      artist,
      genre,
      description,
      image: `ipfs://${coverIpfsHash}`,
      animation_url: `ipfs://${trackIpfsHash}`,
    };

    const metadataIpfsHash = await pinJSONToIPFS(metadata);

    const ipfsUri = `ipfs://${metadataIpfsHash}`;

    return { ipfsUri };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}