export default function decorate(block) {
  const [bg, fg] = block.children;
  bg.className = 'bg';
  fg.className = 'fg';
}
