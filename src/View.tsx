import React from 'react';

// INTENTIONAL ERROR for an end-to-end CI/CD failure classification test.
// Opening tag is <span>, but closing tag is </div>.
export function View() {
  return <span>RAG and CodeBERT-v4 classification check</div>;
}
