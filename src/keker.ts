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
  look(): Promise<void>;
}

class Keker implements IKeker {
  #pool: Array<Source>;

  #result: Array<Object> = [];

  constructor(pool: Array<Source>) {
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

    return data;
  }

  async look() {
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
  }
}

export default Keker;
