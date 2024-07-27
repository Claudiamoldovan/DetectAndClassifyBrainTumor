package com.example.licenta;

import org.opencv.core.Mat;
import org.opencv.ml.Ml;
import org.opencv.ml.SVM;

public class SVMGridSearch {

    public static double[] C_range = {0.0001, 0.0005,0.0007, 0.001,0.002, 0.005, 0.01,0.02, 0.05,0.06,0.07, 0.1,1, 5, 10, 50, 100, 500, 1000,2000};
    public static double[] gamma_range = {.0001,0.0008,0.009, 0.001,0.002,0.0025,0.003,0.0035,0.004,0.005, 0.01, 0.05,0.1, 0.2, 0.5, 1, 2, 5, 10};

    public static SVM performGridSearch(Mat trainingData, Mat labels, Mat validationData, Mat validationLabels) {
        double bestScore = -1;
        double bestC = 0;
        double bestGamma = 0;
        SVM bestModel = null;

        for (double C : C_range) {
            for (double gamma : gamma_range) {
                SVM model = SVM.create();
                model.setC(C);
                model.setGamma(gamma);
                model.setType(SVM.C_SVC);
                model.setKernel(SVM.RBF);

                System.out.println("Training model with C=" + C + ", gamma=" + gamma);
                if (model.train(trainingData, Ml.ROW_SAMPLE, labels)) {
                    double score = evaluateModel(model, validationData, validationLabels);
                    System.out.println("Score for C=" + C + ", gamma=" + gamma + ": " + score);

                    if (score > bestScore) {
                        bestScore = score;
                        bestC = C;
                        bestGamma = gamma;
                        if (bestModel != null) {
                            bestModel.clear();
                        }
                        bestModel = model;
                    } else {
                        model.clear();
                    }
                }
            }
        }

        if (bestModel != null) {
            bestModel.setC(bestC);
            bestModel.setGamma(bestGamma);
        }

        System.out.println("Best Score: " + bestScore + ", Best C: " + bestC + ", Best Gamma: " + bestGamma);
        return bestModel;
    }

    private static double evaluateModel(SVM model, Mat validationData, Mat validationLabels) {
        Mat responses = new Mat();
        model.predict(validationData, responses, 0);
        int correctPredictions = 0;
        for (int i = 0; i < responses.rows(); i++) {
            if (responses.get(i, 0)[0] == validationLabels.get(i, 0)[0]) {
                correctPredictions++;
            }
        }
        return correctPredictions / (double) validationData.rows();
    }
}
