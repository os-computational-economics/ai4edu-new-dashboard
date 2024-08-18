export const preprocessLaTeX = (content: string) => {
  // Add backslash before all dollar signs in the text, except those that are already escaped
  const escapedContent = content.replace(/(?<!\\)\$/g, "\\$");
  // Replace block-level LaTeX delimiters \[ \] with $$ $$

  const blockProcessedContent = escapedContent.replace(
    /\\\[(.*?)\\\]/gs,
    (_, equation) => `$$${equation}$$`
  );
  // Replace inline LaTeX delimiters \( \) with $ $
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\((.*?)\\\)/gs,
    (_, equation) => {
      if (/\\\$/.test(equation)) {
        return `$$ ${equation} $$`;
      }
      return `$${equation}$`;
    }
  );
  return inlineProcessedContent;
};
