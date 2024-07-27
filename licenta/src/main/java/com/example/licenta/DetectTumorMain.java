package com.example.licenta;

import org.opencv.core.*;
import org.opencv.core.Core;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class DetectTumorMain {
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
    }

    private static final double PIXELS_PER_MM = 0.5;


    public static List<String> detectTumor(String imagePath,String cnp) {
        List<String> paths = new ArrayList<>();
        Mat img = Imgcodecs.imread(imagePath, Imgcodecs.IMREAD_COLOR);
        if (img.empty()) {
            System.out.println("Imaginea nu a fost încărcată.");
            return paths;
        }
        Mat imgGray1 = new Mat();
        Imgproc.cvtColor(img, imgGray1, Imgproc.COLOR_BGR2GRAY);
        Mat thresh = new Mat();
        Imgproc.threshold(imgGray1, thresh, 50, 255, Imgproc.THRESH_BINARY);
        List<MatOfPoint> contours = new ArrayList<>();
        Mat hierarchy = new Mat();
        Imgproc.findContours(thresh, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
        double maxVal = -1;
        int maxValIdx = -1;
        for (int contourIdx = 0; contourIdx < contours.size(); contourIdx++) {
            double contourArea = Imgproc.contourArea(contours.get(contourIdx));
            if (maxVal < contourArea) {
                maxVal = contourArea;
                maxValIdx = contourIdx;
            }
        }
        Mat croppedImage = new Mat();
        if (maxValIdx != -1) {
            Rect rect = Imgproc.boundingRect(contours.get(maxValIdx));
            croppedImage = new Mat(img, rect);
        } else {
            System.out.println("No contour found that matches criteria.");
        }
        Mat resizedImg = new Mat();
        Size newSize = new Size(256, 256);
        Imgproc.resize(croppedImage, resizedImg, newSize);

        Mat imgGray = new Mat();
        Imgproc.cvtColor(resizedImg, imgGray, Imgproc.COLOR_BGR2GRAY);

        Imgproc.GaussianBlur(imgGray, imgGray, new Size(3, 3), 30);

        Core.inRange(imgGray, new Scalar(160), new Scalar(255), imgGray);

        Mat kernel = Imgproc.getStructuringElement(Imgproc.MORPH_ELLIPSE, new Size(11, 11));
        Imgproc.dilate(imgGray, imgGray, kernel);
        Imgproc.erode(imgGray, imgGray, kernel);

        Mat edges = new Mat();
        Imgproc.Canny(imgGray, edges, 100, 255);

        List<MatOfPoint> contours1 = new ArrayList<>();
        Mat hierarchy1 = new Mat();
        Imgproc.findContours(edges, contours1, hierarchy1, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

        Rect boundingRect = null;
        double maxArea = -1;
        int maxAreaIdx = -1;
        int minArea=100;

        for (int i = 0; i < contours1.size(); i++) {
            MatOfPoint contour = contours1.get(i);
            double area = Imgproc.contourArea(contour);
            if (area > maxArea && area>minArea &&  !isContourAtEdge(contour, resizedImg.size())) {
                maxArea = area;
                maxAreaIdx = i;
            }
        }
        double diameterMm = 0;


        if (maxAreaIdx != -1) {
            MatOfPoint largestContour = contours1.get(maxAreaIdx);
            boundingRect = Imgproc.boundingRect(largestContour);
            Imgproc.rectangle(resizedImg, boundingRect.tl(), boundingRect.br(), new Scalar(0, 255, 0), 2);
            Imgproc.drawContours(resizedImg, contours1, maxAreaIdx, new Scalar(255, 0, 0), 2);

            double diameterPixels = Math.max(boundingRect.width, boundingRect.height);
            diameterMm = diameterPixels * PIXELS_PER_MM;
            System.out.println("Approximate diameter of the tumor: " + diameterMm + " mm");
        }

    String outputPath = "C://Users/Claud/OneDrive/Desktop/front-licenta/my-app/public/" + cnp + ".jpg";
        Imgcodecs.imwrite(outputPath, resizedImg);
        paths.add(imagePath);
        paths.add(outputPath);
        paths.add(String.valueOf(diameterMm));
        System.out.println("Detectarea tumorii finalizată. Rezultatul salvat în: " + outputPath);


   return paths;
    }

    private static boolean isContourAtEdge(MatOfPoint contour, Size imageSize) {
        Rect rect = Imgproc.boundingRect(contour);
        int margin = 10;
        return rect.x <= margin || rect.y <= margin ||
                rect.x + rect.width >= imageSize.width - margin ||
                rect.y + rect.height >= imageSize.height - margin;
    }

}
