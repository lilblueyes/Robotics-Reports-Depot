const { Dropbox } = require('dropbox');
const formidable = require('formidable-serverless');

module.exports = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).send('Error parsing the files');
    }

    const file = files.file[0]; // La structure peut varier selon la bibliothèque utilisée pour le parsing.
    const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

    // Lire le contenu du fichier
    fs.readFile(file.path, (error, contents) => {
      if (error) {
        console.error('Error reading file:', error);
        return res.status(500).send('Error reading file');
      }

      // Upload du fichier sur Dropbox
      dbx.filesUpload({ path: '/' + file.name, contents })
        .then(() => {
          res.status(200).send({ message: 'File uploaded successfully!' });
        })
        .catch(uploadErr => {
          console.error('Error uploading file:', uploadErr);
          res.status(500).send('Error uploading file');
        });
    });
  });
};
