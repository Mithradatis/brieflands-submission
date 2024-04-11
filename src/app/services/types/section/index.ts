export type sectionsListItem = {
    id: number;
    type: string;
    attributes: {
      journal_id: number;
      status: string;
      title: string;
      flag_id: number;
      display_order: number;
      description: string;
    }
}