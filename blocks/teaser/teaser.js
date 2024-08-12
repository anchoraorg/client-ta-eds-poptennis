export default function decorate(block) {
  console.log('decorating teaser block');
  const [bg, fg] = block.children;
  bg.className = 'bg';
  fg.className = 'fg';
}
