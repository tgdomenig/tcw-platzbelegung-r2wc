import r2wc from '@r2wc/react-to-web-component';
// import Test from './components/Test.js';
import Platzbelegung from './components/Platzbelegung.js';

const platzbelegungCmp = r2wc(Platzbelegung, {shadow: "open"}); //, {shadow: "open"}

customElements.define("my-platzbelegung-r2wc", platzbelegungCmp);
