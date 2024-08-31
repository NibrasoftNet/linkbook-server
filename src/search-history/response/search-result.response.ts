export class SearchResultResponse {
  brand: string | null;
  model: string | null;
  color: string | null;
  referenceNumber: string | null;
  description: string | null;
  result: {
    url: string;
    price: number;
    currency: number;
    title: string;
    url_image: string;
  }[];
}
