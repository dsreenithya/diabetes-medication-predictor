import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function DiabetesMedicationPredictor() {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    hba1c: '',
    diabetesDuration: '',
    kidneyFunction: 'normal',
    cardiovascularDisease: 'no',
    lifestyle: 'sedentary'
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const predictMedication = async () => {
    setLoading(true);
    setPrediction(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple rule-based prediction logic (placeholder for ML model)
    const age = parseInt(formData.age);
    const bmi = parseFloat(formData.bmi);
    const hba1c = parseFloat(formData.hba1c);
    const duration = parseInt(formData.diabetesDuration);
    
    let recommendedMed = '';
    let confidence = 0;
    let rationale = '';
    let alternatives = [];
    
    // Decision logic based on clinical guidelines
    if (hba1c < 7.5) {
      if (bmi > 30) {
        recommendedMed = 'GLP-1 Agonist (e.g., Semaglutide)';
        confidence = 85;
        rationale = 'GLP-1 agonists provide excellent glucose control with weight loss benefits, ideal for patients with elevated BMI and moderate HbA1c.';
        alternatives = ['Metformin', 'SGLT2 Inhibitor'];
      } else {
        recommendedMed = 'Metformin';
        confidence = 90;
        rationale = 'Metformin is first-line therapy for Type 2 diabetes with good kidney function and moderate glucose elevation.';
        alternatives = ['DPP-4 Inhibitor', 'Sulfonylurea'];
      }
    } else if (hba1c >= 7.5 && hba1c < 9) {
      if (formData.cardiovascularDisease === 'yes') {
        recommendedMed = 'SGLT2 Inhibitor (e.g., Empagliflozin)';
        confidence = 88;
        rationale = 'SGLT2 inhibitors offer cardiovascular protection and glucose control for patients with established CVD.';
        alternatives = ['GLP-1 Agonist', 'Metformin + Insulin'];
      } else if (bmi > 30) {
        recommendedMed = 'GLP-1 Agonist + Metformin';
        confidence = 82;
        rationale = 'Combination therapy addresses elevated HbA1c while promoting weight loss.';
        alternatives = ['SGLT2 Inhibitor', 'Basal Insulin'];
      } else {
        recommendedMed = 'Metformin + DPP-4 Inhibitor';
        confidence = 80;
        rationale = 'Dual therapy provides enhanced glucose control with low hypoglycemia risk.';
        alternatives = ['Sulfonylurea', 'Basal Insulin'];
      }
    } else {
      recommendedMed = 'Basal Insulin + Metformin';
      confidence = 87;
      rationale = 'Severely elevated HbA1c requires insulin therapy for rapid glucose control.';
      alternatives = ['GLP-1 Agonist + Basal Insulin', 'Intensive Insulin Regimen'];
    }
    
    // Adjust for kidney function
    if (formData.kidneyFunction === 'impaired') {
      if (recommendedMed.includes('Metformin')) {
        recommendedMed = recommendedMed.replace('Metformin', 'DPP-4 Inhibitor');
        rationale += ' Note: Metformin avoided due to impaired kidney function.';
        confidence -= 5;
      }
    }
    
    setPrediction({
      medication: recommendedMed,
      confidence,
      rationale,
      alternatives,
      warnings: getWarnings(formData)
    });
    
    setLoading(false);
  };
  
  const getWarnings = (data) => {
    const warnings = [];
    if (data.kidneyFunction === 'impaired') {
      warnings.push('Monitor kidney function regularly. Some medications require dose adjustment.');
    }
    if (data.cardiovascularDisease === 'yes') {
      warnings.push('Cardiovascular disease present. Certain medications offer additional cardioprotective benefits.');
    }
    if (parseFloat(data.bmi) > 35) {
      warnings.push('Significant weight management needed. Consider medications that promote weight loss.');
    }
    return warnings;
  };

  const isFormValid = () => {
    return formData.age && formData.bmi && formData.hba1c && formData.diabetesDuration;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              AI Diabetes Medication Predictor
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            This prototype demonstrates how patient-specific data can guide medication selection.
            Enter patient information below to receive a personalized recommendation.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (years)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 55"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BMI (kg/m²)
              </label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 28.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HbA1c (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="hba1c"
                value={formData.hba1c}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 8.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diabetes Duration (years)
              </label>
              <input
                type="number"
                name="diabetesDuration"
                value={formData.diabetesDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kidney Function
              </label>
              <select
                name="kidneyFunction"
                value={formData.kidneyFunction}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="impaired">Impaired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardiovascular Disease
              </label>
              <select
                name="cardiovascularDisease"
                value={formData.cardiovascularDisease}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle
              </label>
              <select
                name="lifestyle"
                value={formData.lifestyle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
              </select>
            </div>
          </div>

          <button
            onClick={predictMedication}
            disabled={!isFormValid() || loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing Patient Data...
              </>
            ) : (
              'Get Medication Recommendation'
            )}
          </button>

          {prediction && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Recommended Medication
                    </h3>
                    <p className="text-2xl font-bold text-green-700 mb-3">
                      {prediction.medication}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Confidence Level
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {prediction.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-gray-700">{prediction.rationale}</p>
                  </div>
                </div>
              </div>

              {prediction.alternatives.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Alternative Options
                  </h3>
                  <ul className="space-y-2">
                    {prediction.alternatives.map((alt, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prediction.warnings.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Clinical Considerations
                      </h3>
                      <ul className="space-y-2">
                        {prediction.warnings.map((warning, idx) => (
                          <li key={idx} className="text-gray-700">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  <strong>Disclaimer:</strong> This is a prototype demonstration using simplified 
                  rule-based logic. A production system would use machine learning trained on 
                  thousands of patient outcomes, pharmacogenomic data, and validated through 
                  clinical trials.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Experiment Documentation
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">What Works:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Quick visualization of how patient data influences recommendations</li>
                <li>Transparent reasoning helps build trust in AI decisions</li>
                <li>Multiple data points create personalized recommendations</li>
                <li>Confidence scores help clinicians understand certainty</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">What Doesn't Work (Limitations):</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Currently uses rule-based logic, not true machine learning</li>
                <li>Missing genetic data (pharmacogenomics)</li>
                <li>No historical treatment response data</li>
                <li>Doesn't account for drug interactions or allergies</li>
                <li>Limited to Type 2 diabetes medications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Next Steps for Real Implementation:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Train ML model on real patient outcome data</li>
                <li>Integrate pharmacogenomic testing results</li>
                <li>Add drug interaction checking</li>
                <li>Validate predictions against clinical trials</li>
                <li>Build EHR integration for seamless workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
