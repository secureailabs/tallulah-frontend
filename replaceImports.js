import { replaceInFile } from 'replace-in-file';

const options = {
  files: 'src/tallulah-ts-client/services/**/*.ts',
  from: "import { request as __request } from '../core/request';",
  to: "import { request as __request } from '../../libs/requestWrapper';",
};

(async () => {
  try {
    const results = await replaceInFile(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
