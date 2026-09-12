import type { ListingInput } from "../domain/types";
export type DiscoveryQuery = { cities: string[]; zips: string[]; updatedSince?: Date };
export interface ListingSourceAdapter { readonly name: string; readonly authorized: boolean; discover(query: DiscoveryQuery): Promise<ListingInput[]>; }
export class CsvListingSource implements ListingSourceAdapter {
  readonly name: string = "csv"; readonly authorized = true;
  constructor(private readonly rows: ListingInput[]) {}
  async discover(query: DiscoveryQuery): Promise<ListingInput[]> { return this.rows.filter((r) => query.cities.includes(r.city) || query.zips.includes(r.zip)); }
}
export class MockListingSource extends CsvListingSource { readonly name = "mock"; }
