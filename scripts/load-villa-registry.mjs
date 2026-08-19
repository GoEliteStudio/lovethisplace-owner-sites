import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export async function loadVillaRegistry() {
  const sourcePath = path.resolve('src/config/i18n.ts');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
  const registryModule = await import(moduleUrl);
  return registryModule.VILLAS;
}
