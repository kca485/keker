import { KekerResult, AvailableSpot } from "./keker";

// ===========
//
// Source List
//
// ===========

const sources: string[] = [];
const sourceList = document.getElementById('source-list') as HTMLElement;
const data = localStorage.getItem('sources') || '[]';
sources.push(...JSON.parse(data));
const sourceTemplate = document.getElementById('source-template') as HTMLTemplateElement;
function renderSources() {
  sourceList.innerHTML = '';
  sources.forEach((source) => {
    const clone = sourceTemplate.content.cloneNode(true) as HTMLElement;
    const sourceSpan = clone.querySelector('.source') as HTMLElement;
    sourceSpan.textContent = source;
    sourceList.appendChild(clone);
  });
}
renderSources();

const newSource = document.getElementById('new-source') as HTMLInputElement;
const addButton = document.getElementById('add-source') as HTMLElement;
addButton.addEventListener('click', () => {
  sources.push(newSource.value.trim());
  localStorage.setItem('sources', JSON.stringify(sources));
  newSource.value = '';
  renderSources();
});

sourceList.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('remove-source')) {
    return;
  }

  const li = target.parentElement as HTMLElement;
  const source = li.firstElementChild?.textContent;
  const targetIndex = sources.findIndex((value) => value === source);
  sources.splice(targetIndex, 1);
  localStorage.setItem('sources', JSON.stringify(sources));
  target.parentElement?.remove();
});

// ======================
//
// Find available Package
//
// ======================

interface IMainProcess {
  look: (urls: string[]) => Promise<void | KekerResult[]>,
}

declare global {
  interface Window {
    mainProcess: IMainProcess,
  }
}

const startButton = document.getElementById('start');
startButton?.addEventListener('click', async () => {
  const data = await window.mainProcess.look(sources);
  if (!data) {
    return;
  }

  console.log(data);
  const resultList = document.getElementById('result') as HTMLElement;
  resultList.innerHTML = '';

  data.forEach((datum) => {
    const linkTemplate = document.getElementById('link-template') as HTMLTemplateElement;
    const clone = linkTemplate.content.cloneNode(true) as HTMLElement;

    const anchor = clone.querySelector('.url') as HTMLAnchorElement;
    anchor.href = datum.url;
    anchor.textContent = datum.url;

    const tender = clone.querySelector('.tender') as HTMLElement;
    const nonTender = clone.querySelector('.non-tender') as HTMLElement;
    const spotTemplate = document.getElementById('spot-template') as HTMLTemplateElement;

    function buildSpot(
      cat: string,
      itm: { title: string, hps: string, dateline: string },
      clss: string,
    ) {
      const spot = spotTemplate.content.cloneNode(true) as HTMLElement;

      const category = spot.querySelector('.category') as HTMLElement;
      const title = spot.querySelector('.title') as HTMLElement;
      const hps = spot.querySelector('.hps') as HTMLElement;
      const dateline = spot.querySelector('.dateline') as HTMLElement;

      category.textContent = cat;
      title.textContent = itm.title;
      hps.textContent = itm.hps;
      dateline.textContent = itm.dateline;

      const spotList = clss === 'Tender' ? tender : nonTender;
      spotList.appendChild(spot);
    }

    const categories: (keyof AvailableSpot)[] = [
      'Pengadaan Barang',
      'Pekerjaan Konstruksi Terintegrasi',
      'Pekerjaan Konstruksi',
      'Jasa Lainnya',
      'Jasa Konsultansi Perorangan Non Konstruksi',
      'Jasa Konsultansi Perorangan Konstruksi',
      'Jasa Konsultansi Badan Usaha Non Konstruksi',
      'Jasa Konsultansi Badan Usaha Konstruksi',
    ];

    // tender list
    if (datum.tender) {
      categories.forEach((cat) => {
        datum.tender[cat]?.forEach((item) => {
          buildSpot(cat, item, 'Tender');
        });
      });
    }

    // non tender list
    if (datum.nonTender) {
      categories.forEach((cat) => {
        datum.nonTender[cat]?.forEach((item) => {
          buildSpot(cat, item, 'Non Tender');
        });
      });
    }

    resultList.appendChild(clone);
  });
});
