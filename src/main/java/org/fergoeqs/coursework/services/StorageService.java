package org.fergoeqs.coursework.services;

import org.springframework.stereotype.Service;
import io.minio.*;
import io.minio.http.Method;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;
@Service
public class StorageService {
    private final MinioClient minioClient;


    public StorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void uploadFile(String bucketName, String objectName, InputStream inputStream, String contentType) {

        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            minioClient.putObject(
                    PutObjectArgs.builder().bucket(bucketName).object(objectName).stream(
                                    inputStream, inputStream.available(), -1)
                            .contentType(contentType)
                            .build());

        } catch (Exception e) {
            throw new RuntimeException("Error during two-phase commit occurred: " + e.getMessage());
        }
    }


    public String generateUrl(String bucketName, String objectName) {
        try {
            GetPresignedObjectUrlArgs getPresignedObjectUrlArgs = GetPresignedObjectUrlArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .method(Method.GET)
                    .expiry(1, TimeUnit.HOURS)
                    .build();

            return minioClient.getPresignedObjectUrl(getPresignedObjectUrlArgs);
        } catch (Exception e) {
            throw new RuntimeException("Error generating URL", e);
        }
    }

    public String generatePublicUrl(String bucketName, String objectName) {
        return "http://localhost:9000/" + bucketName + "/" + objectName;
    }

}

