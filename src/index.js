import r2wc from '@r2wc/react-to-web-component';
import Test from './components/Test.js';
// import Platzbelegung from './components/Platzbelegung0.js';

const testCmp = r2wc(Test);

customElements.define("my-platzbelegung-r2wc", testCmp);
