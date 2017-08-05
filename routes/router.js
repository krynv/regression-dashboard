var express = require('express');
var path = require('path');
var router = express.Router();
var api = require('../api/get_reports.js');

var reportsFolderPath = ('./reports');
 
/* GET environments */
router.get('/environments', (req, res) =>
{
	var environmentFolder = api.getDirectories(reportsFolderPath);
	var environmentFolders = api.getFolderNames(environmentFolder);
	var sortedEnvironmentFolders = api.sortEnvironmentFolders(environmentFolders);

	res.json({ environments: sortedEnvironmentFolders });
});

/* GET features */
router.get('/environments/:environmentName/features', (req, res) =>
{
	var featureFolder = api.getDirectories(path.join(reportsFolderPath, req.params.environmentName));
	var features = api.getLatestTestResult(reportsFolderPath, req.params.environmentName, featureFolder);
	
	res.json({ features: features });
});

/* GET days */
router.get('/environments/:environmentName/features/:featureName/days', (req, res) =>
{
	var dayFolder = api.getDirectories(path.join(reportsFolderPath, req.params.environmentName, req.params.featureName));
	var dayFolders = api.getBasenames(api.getGivenAmountOfDays(dayFolder, 5));

	res.json({ days: dayFolders });
});

/* GET hours */
router.get('/environments/:environmentName/features/:featureName/days/:date/hours', (req, res) =>
{
	var hoursFolder = api.getDirectories(path.join(reportsFolderPath, req.params.environmentName, req.params.featureName,  req.params.date));
	var validationCheck = api.returnValidHourFolders(hoursFolder);
	var hoursFolders = api.getFolderNames(validationCheck);

	res.json({ hours: hoursFolders });
});

/* GET report html files */
router.get('/environments/:environmentName/features/:featureName/days/:date/hours/:time/report', (req, res) =>
{
	var fileExt = '.html';
	var reportDirectory = api.getGivenFileDirectory(path.join(reportsFolderPath, req.params.environmentName, req.params.featureName,  req.params.date, req.params.time), fileExt);

	res.json({ report: reportDirectory });
});

/* GET report json data  */
router.get('/environments/:environmentName/features/:featureName/days/:date/hours/:time/data', (req, res) =>
{
	var fileExt = '.json';
	var dataDirectory = api.getGivenFileDirectory(path.join(reportsFolderPath, req.params.environmentName, req.params.featureName,  req.params.date, req.params.time), fileExt);
	var dataContents = api.getDataContents(dataDirectory);

	res.json({ data: dataContents });
});

// GET latest results only, for a given environment
router.get('/summary/:environmentName', (req, res) =>
{
	var featureFolder = api.getDirectories(path.join(reportsFolderPath, req.params.environmentName));
	var features = api.getLatestTestResult(reportsFolderPath, req.params.environmentName, featureFolder);
	var latestResults = api.getLatestFeatureResultsForSlack(features);

	res.json({
		message: `Summary command triggered for ${req.params.environmentName}`,
		results: latestResults,
	});
});

// GET available features for a given environment
router.get('/summary/:environmentName/features', (req, res) => {
	var features = api.getFolderNames(api.getDirectories(path.join(reportsFolderPath, req.params.environmentName)));

	res.json({ features: features });
});

// GET latest result for a single given feature, on a given environment
router.get('/summary/:environmentName/:featureName', (req, res) =>
{
	var featureFolder = api.getDirectories(path.join(reportsFolderPath, req.params.environmentName));
	var features = api.getLatestTestResult(reportsFolderPath, req.params.environmentName, featureFolder);
	var latestResult = api.getLatestResultForGivenFeatureName(api.getLatestFeatureResultsForSlack(features), req.params.featureName);

	res.json({
		message: `Summary command triggered for ${req.params.environmentName}, ${req.params.featureName}`,
		result: latestResult,
	});
});

router.get('/jenkins', (req, res) =>
{	
	api.getJenkinsJobs().then((data) => {
		// console.log(data);
		res.json({result: data});
	});
});
 
module.exports = router;