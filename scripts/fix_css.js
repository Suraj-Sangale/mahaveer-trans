const fs = require('fs');
let css = fs.readFileSync('f:/nextjs/mahaveer-trans/components/homeWrapper.module.css', 'utf8');

// Replace *, *::before, *::after
css = css.replace(/\*, \*\:\:before, \*\:\:after \{/g, ':global(*) { box-sizing: border-box; margin: 0; padding: 0; }\n:global(*::before) { box-sizing: border-box; margin: 0; padding: 0; }\n:global(*::after) { box-sizing: border-box; margin: 0; padding: 0; }');
css = css.replace(/\*, \*\:\:before, \*\:\:after/g, ':global(*), :global(*::before), :global(*::after)');
css = css.replace(/:root \{/g, ':global(:root) {');
css = css.replace(/\[data-theme="light"\] \{/g, ':global([data-theme="light"]) {');
css = css.replace(/\[data-theme="dark"\] \{/g, ':global([data-theme="dark"]) {');

['body', 'footer', 'section', 'nav'].forEach(tag => {
  const regex = new RegExp(`(^|\\s)${tag}\\s*\\{`, 'g');
  css = css.replace(regex, (match, p1) => `${p1}:global(${tag}) {`);
});

const ids = ['#services', '#numbers', '#about', '#process', '#fleet', '#tracking', '#testimonials', '#cta', '#clients', '#hero'];
ids.forEach(id => {
  const regex = new RegExp(`(^|\\s)${id}\\s*\\{`, 'g');
  css = css.replace(regex, (match, p1) => `${p1}:global(${id}) {`);
});

fs.writeFileSync('f:/nextjs/mahaveer-trans/components/homeWrapper.module.css', css);
console.log('Fixed CSS');
