export default () => {
  const container = document.createElement("div");
  const template = `
     <h1> timeline </h1>
     `;
  container.innerHTML = template;
  return container;
};
