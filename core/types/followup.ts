export type FollowUpFromAPI = {
  id: string;
  vendor: {
    id: string;
    name: string;
    area: string;
    phone: string;
  };
  potential_score: number;
  note?: string;
  follow_up_date: string;
  status: string;
  call_status: string;
};

export type ManagerFollowupsResponse = {
  follow_ups: FollowUpFromAPI[];
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
};

export type FollowUpRow = {
  id: string;
  vendorName: string;
  area: string;
  phone: string;
  potentialScore: number;
  note: string;
  followUpDate: string;
  callStatus: string;
};