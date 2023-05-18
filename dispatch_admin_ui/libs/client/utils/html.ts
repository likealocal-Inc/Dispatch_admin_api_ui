export const getElementById = <T = HTMLElement>(id: string): T => {
  return <T>document.getElementById(id);
};
