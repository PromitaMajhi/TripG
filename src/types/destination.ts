export interface Destination {
  id: string;
  stop_number: number;
  name: string;
  location: string;
  distance: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  category: 'manjalpur' | 'old-city' | 'bajwada' | 'navapura' | 'kishanwadi' | 'darshan' | 'other';
  visited: boolean;
  created_at?: string;
}

export type CreateDestinationInput = Omit<Destination, 'id' | 'created_at'>;
export type UpdateDestinationInput = Partial<CreateDestinationInput>;
