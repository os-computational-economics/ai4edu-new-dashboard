import request from "@/utils/request";

// Define interface for the rating data
export interface RatingData {
  thread_id: string;
  rating: number;
  message_id?: string;
  comments?: string;
}

// API paths
const path = "feedback";
const role = "user";
const api = {
  submitRating: role + `/${path}` + "/rating",
};

// Function to submit a rating
export function submitRating(data: RatingData): Promise<any> {
  return request({
    url: api.submitRating,
    method: "post",
    data,
  });
}
