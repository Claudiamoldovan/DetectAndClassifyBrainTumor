package com.example.licenta;

import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;

import java.util.ArrayList;
import java.util.List;

public class ImageFeatureExtractor {
    public static double[] extractFeatures(Mat grayImage) {

        double[] glcmFeatures = new GLCMFeatureExtractor().extractGLCMFeatures(grayImage);
        double[] advancedFeatures = new AdvancedFeatureExtractor().extractFeatures(grayImage);
        double[] histogramFeatures = extractHistogramFeatures(grayImage);

        double[] allFeatures = new double[glcmFeatures.length + advancedFeatures.length + histogramFeatures.length];
        int index = 0;
        System.arraycopy(glcmFeatures, 0, allFeatures, index, glcmFeatures.length);
        index += glcmFeatures.length;
        System.arraycopy(advancedFeatures, 0, allFeatures, index, advancedFeatures.length);
        index += advancedFeatures.length;
        System.arraycopy(histogramFeatures, 0, allFeatures, index, histogramFeatures.length);
        index += histogramFeatures.length;

        return allFeatures;
    }



    private static double[] extractHistogramFeatures(Mat grayImage) {
        MatOfInt histSize = new MatOfInt(256);
        Mat histogram = new Mat();
        Imgproc.calcHist(java.util.Arrays.asList(grayImage), new MatOfInt(0), new Mat(), histogram, histSize, new MatOfFloat(0, 256));
        Core.normalize(histogram, histogram, 0, 1, Core.NORM_MINMAX);

        float[] histData = new float[256];
        histogram.get(0, 0, histData);

        double[] histFeatures = new double[histData.length];
        for (int i = 0; i < histData.length; i++) {
            histFeatures[i] = histData[i];
        }

        return histFeatures;
    }



}


