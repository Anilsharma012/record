import { queryClient } from './queryClient';

export async function uploadImage(file: File): Promise<string> {
  const img = document.createElement('img');
  const reader = new FileReader();
  const dataUrl: string = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  img.src = dataUrl;
  await new Promise(res => (img.onload = () => res(undefined)));
  const canvas = document.createElement('canvas');
  const maxW = 1600;
  const scale = Math.min(1, maxW / img.width);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const compressed = canvas.toDataURL('image/jpeg', 0.8);
  return compressed;
}

export async function toggleFavorite(listingId: string): Promise<void> {
  const response = await fetch(`/api/listings/${listingId}/favorite`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

  // Invalidate relevant queries
  queryClient.invalidateQueries({ queryKey: ['/api/listings'] });
}

export async function reportListing(listingId: string, reason: string): Promise<void> {
  const response = await fetch(`/api/listings/${listingId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    throw new Error('Failed to report listing');
  }
}
