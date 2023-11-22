// In docker, env files are not parsed correctly, so we remove unintended quotes and newlines
export const dockerEnvVarFix = (envVar: string | undefined) => {
  if (envVar) {
    let newEnvVar = envVar.replaceAll('"', '');
    newEnvVar = newEnvVar.replaceAll('\\n', '\n');
    return newEnvVar;
  } else {
    return undefined;
  }
};
