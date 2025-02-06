declare namespace kakao.maps.services {
  export interface PlacesDetailResult {
    id: string;
    place_name: string;
    category_name: string;
    category_group_code: string;
    category_group_name: string;
    phone: string;
    address_name: string;
    road_address_name: string;
    place_url: string;
    x: string;
    y: string;
    photo?: {
      url: string;
      thumbnail: string;
    }[];
  }

  export type Status = "OK" | "ZERO_RESULT" | "ERROR";

  export class Places {
    keywordSearch(keyword: string, arg1: (data: any, status: any) => void, arg2: { location: LatLng; radius: number; sort: SortBy; }) {
      throw new Error("Method not implemented.");
    }
    getDetails(
      options: { placeId: string },
      callback: (result: PlacesDetailResult[], status: Status) => void
    ): void;
  }
}
