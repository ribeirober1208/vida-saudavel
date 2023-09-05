export default () => {
  const container = document.createElement("div");
  const template = `
     <h1> Home </h1>
     `;
  container.innerHTML = template;
  return container;
};
