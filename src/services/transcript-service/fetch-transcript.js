const request = require('request');
const { promisify } = require('util');
const rp = promisify(request);

const fetchTranscript = async (id) => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const { body } = await rp({url, json: true});

  return {
    id: body.id,
    start: body.start,
    end: body.end,
    symbol: body.display_name,
    geneId: body.Parent
  };
}


module.exports = {
  fetchTranscript
};
