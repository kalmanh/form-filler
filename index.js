const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');

async function createPdf(input, output) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));

    // Modify doc, fill out the form...
    const fieldNames = pdfDoc
      .getForm()
      .getFields()
      .map((f) => f.getName());
    console.log({ fieldNames });

    const form = pdfDoc.getForm();

    const possibleFields = Array.from({ length: 111 }, (_, i) => i);
    possibleFields.forEach((possibleField) => {
      try {
        form
          .getTextField(`Text${possibleField}`)
          .setText(possibleField.toString());
      } catch (error) {
        // console.error(error);
      }
    });

    form.getTextField('Text2').setText('John Smith');

    form.getCheckBox('Check Box7').check();

    pdfDoc.removePage(0);
    pdfDoc.removePage(1);
    pdfDoc.removePage(1);
    pdfDoc.removePage(1);
    pdfDoc.removePage(1);

    const pdfBytes = await pdfDoc.save();

    await writeFile(output, pdfBytes);
    console.log('PDF created!');
  } catch (err) {
    console.log(err);
  }
}

createPdf('medical-claim-form_unlocked.pdf', 'output.pdf');
