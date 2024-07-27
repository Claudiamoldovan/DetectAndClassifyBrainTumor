package com.example.licenta;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDouble;
import org.opencv.imgproc.Imgproc;

public class AdvancedFeatureExtractor {

    public static double[] extractFeatures(Mat grayImage) {

        GLCMFeatureExtractor glcmExtractor = new GLCMFeatureExtractor();
        double[] glcmFeatures = glcmExtractor.extractGLCMFeatures(grayImage);

        StatisticalFeatures stats = new StatisticalFeatures();
        double[] statisticalFeatures = stats.extract(grayImage);

        double[] allFeatures = new double[glcmFeatures.length + statisticalFeatures.length];
        System.arraycopy(glcmFeatures, 0, allFeatures, 0, glcmFeatures.length);
        System.arraycopy(statisticalFeatures, 0, allFeatures, glcmFeatures.length, statisticalFeatures.length);

        return allFeatures;
    }

    static class StatisticalFeatures {
        double[] extract(Mat image) {
            MatOfDouble mean = new MatOfDouble();
            MatOfDouble stddev = new MatOfDouble();
            Core.meanStdDev(image, mean, stddev);

            double meanVal = mean.get(0, 0)[0];
            double stddevVal = stddev.get(0, 0)[0];

            double skewness = calculateSkewness(image, meanVal, stddevVal);
            double kurtosis = calculateKurtosis(image, meanVal, stddevVal);
            return new double[]{meanVal, stddevVal, skewness, kurtosis};
        }
        private double calculateSkewness(Mat image, double mean, double stddev) {
            Mat temp = new Mat();
            Core.subtract(image, Mat.ones(image.size(), image.type()).mul(Mat.ones(image.size(), image.type()), mean), temp);
            Core.pow(temp, 3, temp);
            double meanThirdMoment = Core.mean(temp).val[0];
            return meanThirdMoment / Math.pow(stddev, 3);
        }
        private double calculateKurtosis(Mat image, double mean, double stddev) {
            Mat temp = new Mat();
            Core.subtract(image, Mat.ones(image.size(), image.type()).mul(Mat.ones(image.size(), image.type()), mean), temp);
            Core.pow(temp, 4, temp);
            double meanFourthMoment = Core.mean(temp).val[0];
            return (meanFourthMoment / Math.pow(stddev, 4)) - 3;
        }
    }
}
