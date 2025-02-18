package org.fergoeqs.coursework.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.fergoeqs.coursework.models.MedicalProcedure;
import org.fergoeqs.coursework.services.StorageService;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
public class ReportGenerator {
    private final StorageService storageService;

    public ReportGenerator(StorageService storageService) {
        this.storageService = storageService;
    }

    public String generateProcedureReport(MedicalProcedure procedure) throws IOException {
        PDDocument document = new PDDocument();

        PDPage page = new PDPage();
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        float maxWidth = page.getMediaBox().getWidth() - 60;

        File fontFile = new File("K:/git/coursework/vetcare/src/main/resources/fonts/times_new_roman.ttf");
        PDType0Font font = PDType0Font.load(document, fontFile);

        File logoFile = new File("K:/git/coursework/vetcare/src/main/resources/images/logo_min.png");
        File stampoFile = new File("K:/git/coursework/vetcare/src/main/resources/images/stamp.png");

        PDImageXObject logo = PDImageXObject.createFromFile(logoFile.getAbsolutePath(), document);
        PDImageXObject stamp = PDImageXObject.createFromFile(stampoFile.getAbsolutePath(), document);


        contentStream.drawImage(logo, 40, 700, 70, 70);
        contentStream.beginText();
        contentStream.setFont(font, 16);
        contentStream.newLineAtOffset(180, 750);
        contentStream.showText("limited liability company «VetCare Clinic»");
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(font, 16);
        contentStream.newLineAtOffset(220, 730);
        contentStream.showText("Medical procedure report");
        contentStream.endText();


        contentStream.beginText();
        contentStream.setFont(font, 12);
        contentStream.newLineAtOffset(40, 670);
        contentStream.showText("Pet: " + procedure.getPet().getName());
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText("Procedure Name: " + procedure.getName());
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText("Type: " + procedure.getType());
        contentStream.endText();

        float descriptionY = showTextWithLineBreak(contentStream, "Description: " + procedure.getDescription(), 40, 625, maxWidth, font);

        float notesY = showTextWithLineBreak(contentStream, "Notes: " + procedure.getNotes(), 40, descriptionY, maxWidth, font);



        contentStream.beginText();
        contentStream.setFont(font, 12);
        contentStream.newLineAtOffset(40, 150);
        contentStream.showText(("Date: " + procedure.getDate().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy"))));
        contentStream.newLineAtOffset(0, -15);
        contentStream.showText("Veterinarian: " + procedure.getVet().getName());
        contentStream.endText();

        contentStream.drawImage(stamp, 450, 40, 100, 100);

        contentStream.close();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.save(outputStream);
        document.close();

        InputStream pdfInputStream = new ByteArrayInputStream(outputStream.toByteArray());

        String objectName = "medical_report_" + procedure.getId() + ".pdf";
        String bucketName = "vetcare";

        storageService.prepareUploadFile(bucketName, objectName, pdfInputStream, "application/pdf");
        storageService.uploadFile(bucketName, objectName, pdfInputStream, "application/pdf");
        System.out.println(storageService.generateUrl(bucketName, objectName));

        pdfInputStream.close();

        return objectName;
    }

    public String generateReportUrl(String objectName) {
        return storageService.generateUrl("vetcare", objectName);
    }

    private float showTextWithLineBreak(PDPageContentStream contentStream, String text, float x, float y, float maxWidth, PDType0Font font) throws IOException {
        contentStream.beginText();
        contentStream.setFont(font, 12);
        contentStream.newLineAtOffset(x, y);

        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        float currentY = y;

        for (String word : words) {
            line.append(word).append(" ");
            if (getTextWidth(line.toString(), font) > maxWidth) {
                contentStream.showText(line.toString().trim());
                contentStream.newLineAtOffset(0, -15);
                currentY -= 15;
                line = new StringBuilder(word + " ");
            }
        }
        contentStream.showText(line.toString().trim());
        contentStream.endText();
        return currentY - 15;
    }

    private float getTextWidth(String text, PDType0Font font) {
        try {
            return font.getStringWidth(text) / 1000 * 16;
        } catch (IOException e) {
            return 0;
        }
    }
}


