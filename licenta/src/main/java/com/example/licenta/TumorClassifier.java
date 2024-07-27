package com.example.licenta;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.ml.SVM;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class TumorClassifier {

    private static final String[] CLASS_LABELS = {"tumora prezenta", "absenta tumora"};
    private static final String MODEL_PATH = "src/main/resources/svm_model.xml";

    public static String classifier(String inputPath) {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        SVM bestModel;

        if (!Files.exists(Paths.get(MODEL_PATH))) {

            File gliomaDir = new File("src/main/resources/data/glioma_tumor");
            File noTumor = new File("src/main/resources/data/no_tumor");

            List<double[]> trainFeaturesList = new ArrayList<>();
            List<Integer> trainLabelsList = new ArrayList<>();
            extractFeaturesAndLabels(new File(gliomaDir, "yes"), trainFeaturesList, trainLabelsList, 0, 1500);
            extractFeaturesAndLabels(new File(noTumor, "no"), trainFeaturesList, trainLabelsList, 1, 1500);

            Mat trainData = convertFeaturesListToMat(trainFeaturesList, trainFeaturesList.get(0).length);
            Mat trainLabels = convertLabelsListToMat(trainLabelsList, 1);

            List<double[]> validateFeaturesList = new ArrayList<>();
            List<Integer> validateLabelsList = new ArrayList<>();
            extractFeaturesAndLabels(new File(gliomaDir, "validate"), validateFeaturesList, validateLabelsList, 0, 84);
            extractFeaturesAndLabels(new File(noTumor, "validate"), validateFeaturesList, validateLabelsList, 1, 84);

            Mat validateData = convertFeaturesListToMat(validateFeaturesList, validateFeaturesList.get(0).length);
            Mat validateLabels = convertLabelsListToMat(validateLabelsList, 1);

            bestModel = SVMGridSearch.performGridSearch(trainData, trainLabels, validateData, validateLabels);
            bestModel.save(MODEL_PATH);
        } else {
            bestModel = SVM.load(MODEL_PATH);
        }

        File newImageFile = new File(inputPath);
        Mat newImage = Imgcodecs.imread(newImageFile.getAbsolutePath());
        double[] newFeatures = ImageFeatureExtractor.extractFeatures(newImage);
        Mat testData = new Mat(1, newFeatures.length, CvType.CV_32F);
        testData.put(0, 0, newFeatures);

        float result = bestModel.predict(testData);
        System.out.println(getClassLabel(result));
        return getClassLabel(result);
    }

    private static void extractFeaturesAndLabels(File directory, List<double[]> featuresList, List<Integer> labelsList, int label, int limit) {
        File[] files = directory.listFiles();
        if (files == null) return;

        for (int i = 0; i < Math.min(files.length, limit); i++) {
            Mat image = Imgcodecs.imread(files[i].getAbsolutePath());
            double[] features = ImageFeatureExtractor.extractFeatures(image);
            featuresList.add(features);
            labelsList.add(label);
        }
    }

    private static Mat convertFeaturesListToMat(List<double[]> list, int cols) {
        Mat mat = new Mat(list.size(), cols, CvType.CV_32F);
        for (int i = 0; i < list.size(); i++) {
            mat.put(i, 0, list.get(i));
        }
        return mat;
    }

    private static Mat convertLabelsListToMat(List<Integer> list, int cols) {
        Mat mat = new Mat(list.size(), cols, CvType.CV_32S);
        for (int i = 0; i < list.size(); i++) {
            mat.put(i, 0, new double[]{list.get(i)});
        }
        return mat;
    }

    private static String getClassLabel(float result) {
        int classIndex = (int) result;
        if (classIndex >= 0 && classIndex < CLASS_LABELS.length) {
            return CLASS_LABELS[classIndex];
        } else {
            return "Clasă necunoscută";
        }
    }

    

}
