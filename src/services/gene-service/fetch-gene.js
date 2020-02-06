const request = require('request');
const { promisify } = require('util');
const rp = promisify(request);

const fetchGene = async (id) => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json&expand=1`;
  const { body } = await rp({url, json: true});


  return {
    id: body.id,
    start: body.start,
    end: body.end,
    symbol: body.display_name,
    description: body.description,
    transcripts: body.Transcript.slice(0, 5).map(({id}) => id)
  };
}


module.exports = {
  fetchGene
};
