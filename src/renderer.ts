interface IMainProcess {
  look: () => Promise<void | Array<Object>>,
}

interface Window {
  mainProcess: IMainProcess,
}

const startButton = document.getElementById('start');
startButton?.addEventListener('click', async () => {
  const data = await window.mainProcess.look();
  console.log(data);
});
