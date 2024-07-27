package com.example.licenta;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;

import java.util.Arrays;

public class GLCMFeatureExtractor {
    public double[] extractGLCMFeatures(Mat grayImage) {
        Mat glcm = computeGLCM(grayImage);

        double[] glcmFeatures = extractFeaturesFromGLCM(glcm);

        double meanIntensity = Core.mean(grayImage).val[0];

        double[] features = new double[glcmFeatures.length + 1];
        System.arraycopy(glcmFeatures, 0, features, 0, glcmFeatures.length);
        features[features.length - 1] = meanIntensity;

        return features;
    }

    private Mat computeGLCM(Mat grayImage) {
        int numLevels = 256;
        int[] distances = {1};
        int[] angles = {0, 45, 90, 135};
        Mat glcm = new Mat(numLevels, numLevels, CvType.CV_32F);
        for (int i = 0; i < numLevels; i++) {
            for (int j = 0; j < numLevels; j++) {
                glcm.put(i, j, 0);
            }
        }
        for (int angle : angles) {
            for (int i = 0; i < grayImage.rows(); i++) {
                for (int j = 0; j < grayImage.cols(); j++) {
                    int pixelValue = (int) grayImage.get(i, j)[0];
                    int i2 = i + distances[0];
                    int j2 = j + distances[0];
                    if (i2 >= 0 && i2 < grayImage.rows() && j2 >= 0 && j2 < grayImage.cols()) {
                        int neighborValue = (int) grayImage.get(i2, j2)[0];
                        double[] oldValue = glcm.get(pixelValue, neighborValue);
                        double newValue = oldValue[0] + 1;
                        glcm.put(pixelValue, neighborValue, newValue);
                    }
                }
            }
        }
        Core.normalize(glcm, glcm, 1, 0, Core.NORM_L1);

        return glcm;
    }

    private double[] extractFeaturesFromGLCM(Mat glcm) {
        double contrast = glcmContrast(glcm);
        double correlation = glcmCorrelation(glcm);
        double energy = glcmEnergy(glcm);
        double homogeneity = glcmHomogeneity(glcm);
        double sumAverage = glcmSumAverage(glcm);
        double sumVariance = glcmSumVariance(glcm, sumAverage);
        double sumEntropy = glcmSumEntropy(glcm);
        double differenceVariance = glcmDifferenceVariance(glcm);
        double differenceEntropy = glcmDifferenceEntropy(glcm);

        return new double[]{contrast, correlation, energy, homogeneity, sumAverage, sumVariance, sumEntropy, differenceVariance,
                differenceEntropy};
    }

    private double glcmDifferenceVariance(Mat glcm) {
        double[] pMinus = calculateDifferenceArray(glcm);
        double mean = calculateMean(pMinus);
        double differenceVariance = 0;
        for (int i = 0; i < pMinus.length; i++) {
            differenceVariance += (i - mean) * (i - mean) * pMinus[i];
        }
        return differenceVariance;
    }

    private double glcmDifferenceEntropy(Mat glcm) {
        double[] pMinus = calculateDifferenceArray(glcm);
        double differenceEntropy = 0;
        for (double p : pMinus) {
            if (p != 0) {
                differenceEntropy -= p * Math.log(p);
            }
        }
        return differenceEntropy;
    }

    private double[] calculateDifferenceArray(Mat glcm) {
        int size = glcm.rows();
        double[] pMinus = new double[size];
        Arrays.fill(pMinus, 0.0);

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                pMinus[Math.abs(i - j)] += glcm.get(i, j)[0];
            }
        }
        return pMinus;
    }

    private double calculateMean(double[] array) {
        double sum = 0;
        for (double val : array) {
            sum += val;
        }
        return sum / array.length;
    }

    private double glcmContrast(Mat glcm) {
        double contrast = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                contrast += Math.pow(i - j, 2) * glcm.get(i, j)[0];
            }
        }
        return contrast;
    }

    private double glcmCorrelation(Mat glcm) {
        double correlation = 0;
        double mean_i = 0;
        double mean_j = 0;
        double std_i = 0;
        double std_j = 0;
        double sum = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                sum += glcm.get(i, j)[0];
                mean_i += i * glcm.get(i, j)[0];
                mean_j += j * glcm.get(i, j)[0];
            }
        }
        mean_i /= sum;
        mean_j /= sum;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                std_i += Math.pow(i - mean_i, 2) * glcm.get(i, j)[0];
                std_j += Math.pow(j - mean_j, 2) * glcm.get(i, j)[0];
            }
        }
        std_i = Math.sqrt(std_i / sum);
        std_j = Math.sqrt(std_j / sum);
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                correlation += ((i - mean_i) * (j - mean_j) * glcm.get(i, j)[0]) / (std_i * std_j);
            }
        }
        return correlation;
    }

    private double glcmEnergy(Mat glcm) {
        double energy = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                energy += Math.pow(glcm.get(i, j)[0], 2);
            }
        }
        return energy;
    }

    private double glcmHomogeneity(Mat glcm) {
        double homogeneity = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                homogeneity += glcm.get(i, j)[0] / (1 + Math.abs(i - j));
            }
        }
        return homogeneity;
    }

    private double glcmSumAverage(Mat glcm) {
        double sumAverage = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                sumAverage += (i + j) * glcm.get(i, j)[0];
            }
        }
        return sumAverage;
    }

    private double glcmSumVariance(Mat glcm, double sumAverage) {
        double sumVariance = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                sumVariance += Math.pow(i + j - sumAverage, 2) * glcm.get(i, j)[0];
            }
        }
        return sumVariance;
    }

    private double glcmSumEntropy(Mat glcm) {
        double sumEntropy = 0;
        for (int i = 0; i < glcm.rows(); i++) {
            for (int j = 0; j < glcm.cols(); j++) {
                double val = glcm.get(i, j)[0];
                if (val != 0) {
                    sumEntropy -= val * Math.log(val);
                }
            }
        }
        return sumEntropy;
    }
}
