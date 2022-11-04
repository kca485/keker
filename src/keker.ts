import fetch from 'node-fetch';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio/lib/slim';

const TENDER_TABLE_BODY = '.card-primary tbody';
const NON_TENDER_TABLE_BODY = '.card-danger tbody';
const CATEGORY_QUANTITY = 8;

interface Source {
  name?: string,
  url: string,
}

interface IKeker {
  look(): Promise<void | KekerResult[]>;
}

interface AvailableSpotDetails {
  title: string,
  hps: string,
  dateline: string,
}

export interface AvailableSpot {
  'Pengadaan Barang': AvailableSpotDetails[],
  'Jasa Konsultansi Badan Usaha Non Konstruksi': AvailableSpotDetails[],
  'Pekerjaan Konstruksi': AvailableSpotDetails[],
  'Jasa Lainnya': AvailableSpotDetails[],
  'Jasa Konsultansi Perorangan Non Konstruksi': AvailableSpotDetails[],
  'Jasa Konsultansi Badan Usaha Konstruksi': AvailableSpotDetails[],
  'Jasa Konsultansi Perorangan Konstruksi': AvailableSpotDetails[],
  'Pekerjaan Konstruksi Terintegrasi': AvailableSpotDetails[],
}

export interface KekerResult {
  url: string,
  tender: AvailableSpot,
  nonTender: AvailableSpot
}

class Keker implements IKeker {
  #pool: Source[];

  #result: KekerResult[] = [];

  constructor(pool: Source[]) {
    this.#pool = pool;
  }

  async #get(lpseUrl: string) {
    const response = await fetch(lpseUrl);
    if (!response.ok) {
      return;
    }

    const doc = await response.text();
    return doc;
  }

  #format($: CheerioAPI, rows: Cheerio<AnyNode>, source: Source) {
    const data: { [key: string]: any } = {
      url: source.url,
    };

    if (source.name) {
      data.source = source.name;
    }

    rows.each((i, row) => {
      const title = $('td:nth-child(2) a', row).text();
      const hps = $('td:nth-child(3)', row).text();
      const dateline = $('td:nth-child(4)', row).text();

      const className = $(row).attr('class');
      if (!className) {
        return;
      }

      let category = className.endsWith('_pl') ? 'nonTender' : 'tender';
      let subCategory = className.replace('_pl', '').replace(/_/g, ' ');

      if (!data[category]) {
        data[category] = {};
      }
      if (!data[category][subCategory]) {
        data[category][subCategory] = [];
      }

      data[category][subCategory].push({ title, hps, dateline });
    });

    return data as KekerResult;
  }

  async look() {
    this.#result = [];

    for (const source of this.#pool) {
      const doc = await this.#get(source.url);
      if (!doc) {
        return;
      }
      const $ = load(doc);

      const rows = $('.content tr[class]');
      if (!rows) {
        return;
      }

      const data = this.#format($, rows, source);
      this.#result.push(data);
    }

    return this.#result;
  }
}

export default Keker;
