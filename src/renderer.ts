import { KekerResult } from "./keker";

interface IMainProcess {
  look: () => Promise<void | KekerResult[]>,
}

declare global {
  interface Window {
    mainProcess: IMainProcess,
  }
}


const startButton = document.getElementById('start');
startButton?.addEventListener('click', async () => {
  const data = await window.mainProcess.look();
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

    const spotList = clone.querySelector('.spot-list') as HTMLElement;
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

      category.textContent = `${clss}: ${cat}`;
      title.textContent = itm.title;
      hps.textContent = itm.hps;
      dateline.textContent = itm.dateline;

      spotList.appendChild(spot);
    }

    // tender list
    datum.tender['Pengadaan Barang']?.forEach((item) => {
      buildSpot('Pengadaan Barang', item, 'Tender');
    });
    datum.tender['Pekerjaan Konstruksi Terintegrasi']?.forEach((item) => {
      buildSpot('Pekerjaan Konstruksi Terintegrasi', item, 'Tender');
    });
    datum.tender['Pekerjaan Konstruksi']?.forEach((item) => {
      buildSpot('Pekerjaan Konstruksi', item, 'Tender');
    });
    datum.tender['Jasa Lainnya']?.forEach((item) => {
      buildSpot('Jasa Lainnya', item, 'Tender');
    });
    datum.tender['Jasa Konsultansi Perorangan Non Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Perorangan Non Konstruksi', item, 'Tender');
    });
    datum.tender['Jasa Konsultansi Perorangan Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Perorangan Konstruksi', item, 'Tender');
    });
    datum.tender['Jasa Konsultansi Badan Usaha Non Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Badan Usaha Non Konstruksi', item, 'Tender');
    });
    datum.tender['Jasa Konsultansi Badan Usaha Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Badan Usaha Konstruksi', item, 'Tender');
    });

    // non tender list
    datum.nonTender['Pengadaan Barang']?.forEach((item) => {
      buildSpot('Pengadaan Barang', item, 'Non Tender');
    });
    datum.nonTender['Pekerjaan Konstruksi Terintegrasi']?.forEach((item) => {
      buildSpot('Pekerjaan Konstruksi Terintegrasi', item, 'Non Tender');
    });
    datum.nonTender['Pekerjaan Konstruksi']?.forEach((item) => {
      buildSpot('Pekerjaan Konstruksi', item, 'Non Tender');
    });
    datum.nonTender['Jasa Lainnya']?.forEach((item) => {
      buildSpot('Jasa Lainnya', item, 'Non Tender');
    });
    datum.nonTender['Jasa Konsultansi Perorangan Non Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Perorangan Non Konstruksi', item, 'Non Tender');
    });
    datum.nonTender['Jasa Konsultansi Perorangan Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Perorangan Konstruksi', item, 'Non Tender');
    });
    datum.nonTender['Jasa Konsultansi Badan Usaha Non Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Badan Usaha Non Konstruksi', item, 'Non Tender');
    });
    datum.nonTender['Jasa Konsultansi Badan Usaha Konstruksi']?.forEach((item) => {
      buildSpot('Jasa Konsultansi Badan Usaha Konstruksi', item, 'Non Tender');
    });

    resultList.appendChild(clone);
  });
});
