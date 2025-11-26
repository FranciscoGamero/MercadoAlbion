export interface ItemChartResponse {
  location: string;
  item_id: string;
  quality: number;
  data: ItemChartData;
}

export interface ItemChartData {
  timestamps: string[];
  prices_avg: number[];
  item_count: number[];
}