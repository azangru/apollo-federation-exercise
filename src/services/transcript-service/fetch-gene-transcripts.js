const request = require('request');
const { promisify } = require('util');
const rp = promisify(request);

const fetchGeneTranscripts = async (geneId) => {
  const url = `https://rest.ensembl.org/lookup/id/${geneId}?content-type=application/json&expand=1`;
  const { body } = await rp({url, json: true});

  return body.Transcript.slice(0, 5).map((transcript) => ({
    id: transcript.id,
    start: transcript.start,
    end: transcript.end,
    symbol: transcript.display_name,
    geneId: transcript.Parent
  }));
}


module.exports = {
  fetchGeneTranscripts
};
