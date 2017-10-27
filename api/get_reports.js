(() => {
	var _ = require('lodash');
	var fs = require('fs');
	var concatMap = require('concat-map');
	var path = require('path');
	var jenkinsapi = require('jenkins-api');
	var jenkins = jenkinsapi.init("http://jenkinsserver:8080/");
	var http = require('http');
	var dateformat = require("dateformat");
	var convertTime = require("convert-time");
	var Promise = require('promise');

	var getDirectories = (givenDirectoryPath) => {
		var folders = fs.readdirSync(givenDirectoryPath);

		return concatMap(folders, (foundDirectory) => {
			var directoryPath = path.join(givenDirectoryPath, foundDirectory);
			var lstat = fs.lstatSync(directoryPath);

			return (lstat && lstat.isDirectory()) ? directoryPath : false;
		});
	}

	var getGivenFileDirectory = (givenDirectoryPath, fileExt) => {
		var folder = [];
		try {
			folder = fs.readdirSync(givenDirectoryPath);
		}
		catch (exception) {
			// ignore
		}
		var directory = '';

		_.each(folder, (returnedItems) => {

			var directoryPath = path.join(givenDirectoryPath, returnedItems);

			if (_.includes(directoryPath, fileExt)) {
				directory = directoryPath;
			}
		});

		return directory;
	}

	var getFolderNames = (givenFolder) => {
		var folderNameArray = [];

		_.each(givenFolder, (returnedFolderDir) => {
			if (returnedFolderDir != false) {
				
				folderNameArray.push(path.basename(returnedFolderDir));
			}
		});

		return folderNameArray;
	}

	var getGivenAmountOfDays = (givenFolder, numberOfGivenDays) => {
		var folderNameArray = [];
		var counter = 0;

		_.each(givenFolder.reverse(), (returnedFolder) => {
			if (counter < numberOfGivenDays) {
				folderNameArray.push(returnedFolder);
				counter++;
			}
		});

		return folderNameArray;
	}

	var getBasenames = (givenArray) => {
		var returnedArray = [];

		_.each(givenArray, (individualItem) => {
			returnedArray.push(path.basename(individualItem));
		});

		return returnedArray;
	}

	var formatDays = (givenArray) => {
		var basenameDays = getBasenames(givenArray);
		var returnedArray = [];

		_.each(basenameDays, (individualDay) => {
			returnedArray.push(dateformat(individualDay, "dddd, mmm d, yyyy"));
		});

		return returnedArray;
	}

	var formatTime = (givenTime) => {
		var formattedTime = givenTime.replace('.', ':')
			.replace('.', ':')
			.replace('chrome', 'Chrome')
			.replace('firefox', 'Firefox')
			.replace('internet explorer', 'Internet Explorer')
			.replace('safari', 'Safari');

		if (/\s/.test(formattedTime)) {
			// It has any kind of whitespace
			var time = formattedTime.substr(0, formattedTime.indexOf(' '));
			var browser = formattedTime.substr(formattedTime.indexOf(' ') + 1);

			if (convertTime(time, "HH:mm A")) {
				return `${convertTime(time, "HH:mm A")} on ${browser}`;
			}
			else {
				return `${formattedTime}`;
			}
		}
		else
			return `${formattedTime}`;
	}

	var returnValidHourFolders = (givenArray) => {
		var returnedArray = [];

		_.each(givenArray, (returnedTimeFolder) => {
			if (returnedTimeFolder != false) {
				var folder = fs.readdirSync(returnedTimeFolder);
				_.each(folder, (returnedItems) => {
					var directoryPath = path.join(returnedTimeFolder, returnedItems);
					if (_.includes(directoryPath, '.html')) {
						returnedArray.push(returnedTimeFolder);
					}
				});
			}
		});


		return returnedArray;
	}

	var getDataContents = (receivedDataDirectory) => {
		return JSON.parse(fs.readFileSync(receivedDataDirectory, 'utf8'));
	}

	var getLatestTestResult = (reportFolderPath, environmentName, givenDirectoryArray) => {
		var features = [];

		_.each(givenDirectoryArray, (returnedFeatureFolderDirectory) => {
			if (returnedFeatureFolderDirectory != false) {
				var featureName = path.basename(returnedFeatureFolderDirectory);
				var featureFolderContents = fs.readdirSync(returnedFeatureFolderDirectory);

				if (featureFolderContents.length > 0) {
					var collectionOfValidDayFolders = [];
					//console.log(featureFolderContents);
					for (var i = 0; i < featureFolderContents.length; i++) {
						if (featureFolderContents[i] != '.DS_Store') {
							var directory = path.join(returnedFeatureFolderDirectory, featureFolderContents[i]);
							
							var lstat = fs.lstatSync(directory);
	
							if (lstat.isDirectory()) {
								var folderContents = fs.readdirSync(directory);
								
								if (folderContents.length > 0) {
									//console.log(directory);
									collectionOfValidDayFolders.push(path.basename(directory));
								}
							}
						}
					}
					
					var latestDay = collectionOfValidDayFolders[collectionOfValidDayFolders.length - 1];

					if (latestDay != undefined) {
						
						var directoryPathOfLatestDay = path.join(returnedFeatureFolderDirectory, latestDay);
						var dayFolderContents = fs.readdirSync(directoryPathOfLatestDay);
						
						if (dayFolderContents.length > 0) {

							var collectionOfValidTimeFolders = [];
							//for each day folder contents, gimme the latest, VALID, time cyka blyat
							for (var i = 0; i < dayFolderContents.length; i++) {
								if (dayFolderContents[i] != '.DS_Store') {
									var individualDirectory = path.join(returnedFeatureFolderDirectory, latestDay, dayFolderContents[i]);
									var lstat = fs.lstatSync(individualDirectory);
									
									if (lstat.isDirectory()) {
										var folderContentsOfIndividualDirectory = fs.readdirSync(individualDirectory);
										
										if (folderContentsOfIndividualDirectory.length >= 4) {
											collectionOfValidTimeFolders.push(path.basename(individualDirectory));
										}
										
									}
								}
								
							}

							var latestHour = collectionOfValidTimeFolders[collectionOfValidTimeFolders.length - 1];
							
							if (latestHour != undefined) {
								var directoryPathOfLatestHour = path.join(returnedFeatureFolderDirectory, latestDay, latestHour);
								var hourFolderContents = fs.readdirSync(directoryPathOfLatestHour);
								
								var latestHTMLReportDirectory;

								_.each(hourFolderContents, (returnedItems) => {
									if (_.includes(returnedItems, '.html')) {
										latestHTMLReportDirectory = path.join(returnedFeatureFolderDirectory, latestDay, latestHour, returnedItems);
									}
								});

								_.each(hourFolderContents, (returnedItems) => {

									var directoryPathOfDataFile = path.join(returnedFeatureFolderDirectory, latestDay, latestHour, returnedItems);
									if (_.includes(directoryPathOfDataFile, '.json')) {
										var latestResult;
										var stats = fs.statSync(directoryPathOfDataFile);

										if (stats.size > 0 && stats.size < 300) {
											var contentsOfDataFile = getDataContents(directoryPathOfDataFile);
											var latestResult = contentsOfDataFile.percentagePassed;
										}
										else {
											latestResult = 0;
										}
										
										if (latestHTMLReportDirectory != undefined) {
											var feature =
												{
													name: featureName,
													latestDay: dateformat(latestDay, "dddd, mmm d, yyyy"),
													latestHour: formatTime(latestHour),
													latestResult: latestResult,
													latestReportLink: latestHTMLReportDirectory,
													days: [],
												};

											features.push(feature);
											
											var latestFiveDaysArray = getGivenAmountOfDays(featureFolderContents, 5);

											// check the contents of the array to make sure the folder actually contains something, otherwise don't even send it
											var validLatestFiveDaysArray = [];

											
											_.each(latestFiveDaysArray, (individualDay) => {

												var directoryPathOfIndividualDay = getDirectories(path.join(reportFolderPath, environmentName, feature.name, individualDay));
												
												if (directoryPathOfIndividualDay.length > 0) {
													validLatestFiveDaysArray.push(individualDay);
												}
											});
											
											_.each(validLatestFiveDaysArray, (individualDay) => {

												feature.days.push(
													{
														date: individualDay,
														active: false,
														hours: [],
													});
											});
											
											_.each(feature.days, (day) => {
												var validIndividualTime = returnValidHourFolders(getDirectories(path.join(reportFolderPath, environmentName, feature.name, day.date)));
												
												if (validIndividualTime.length > 0) {
													_.each(validIndividualTime, (individualTime) => {
														var reportLink = getGivenFileDirectory(path.join(reportFolderPath, environmentName, feature.name, day.date, path.basename(individualTime)), '.html');
														var resultDirectoryPath = getGivenFileDirectory(path.join(reportFolderPath, environmentName, feature.name, day.date, path.basename(individualTime)), '.json');
														var stats = fs.statSync(resultDirectoryPath);

														if (stats.size > 0 && stats.size < 300) {
															var resultContents = JSON.parse(fs.readFileSync(resultDirectoryPath, 'utf8'));
															var summary = "failing";

															if (resultContents.fail === 0) {
																summary = "passing";
															}

															day.hours.push(
															{
																visible: true,
																time: formatTime(path.basename(individualTime)),
																link: reportLink,
																summary: summary,
																results: resultContents,
															});
														}
													});
												}
											});

											_.each(feature.days, (day) => {
												if (day) {
													if (day.hours.length == 0) {
														feature.days.splice(feature.days.indexOf(day), 1);
													}
												}
											});
										}
									}
								});
							}
						}
					}
				}
			}

		});

		return features;
	}

	var sortEnvironmentFolders = (givenEnvironmentArray) => {
		var returnedEnvironmentArray = [];
		var appendingArray = [];

		_.each(givenEnvironmentArray, (individualEnvironment) => {

			switch (individualEnvironment) {
				case 'Production':
					appendingArray.push(individualEnvironment);
					break;
				case 'Production_EMEA':
					appendingArray.push(individualEnvironment);
					break;
				default:
					returnedEnvironmentArray.push(individualEnvironment);
			}
		});

		return returnedEnvironmentArray.concat(appendingArray);
	}

	var getLatestFeatureResultsForSlack = (givenArray) => {
		var returnArray = [];

		_.each(givenArray, (individualFeature) => {
			var individualSummaryResults = {
				featureName: individualFeature.name,
				latestDay: individualFeature.latestDay,
				latestHour: individualFeature.latestHour,
				latestResult: individualFeature.latestResult,
				latestReportLink: individualFeature.latestReportLink,
			};
			returnArray.push(individualSummaryResults);
		});

		return returnArray;
	}

	var getLatestResultForGivenFeatureName = (givenArray, requestedFeature) => {

		var returnedArray = [];

		_.each(givenArray, (individualFeature) => {

			if (individualFeature.featureName === requestedFeature) {
				returnedArray.push(individualFeature);
			}
		});

		return returnedArray;
	}

	var getJenkinsJobs = () => {
		return new Promise((resolve, reject) => {
			var jenkinsJobs = [];

			jenkins.all_jobs((err, data) => {
				if (err) {
					return console.log(err);
				}
				var count = 0;
				_.each(data, (individualJob) => {
					count++;
					if (individualJob.name.includes('Regression')) {
						jenkins.last_build_info(individualJob.name, (err, data) => {
							if (err) { return console.log(err); }

							var jenkinsSummary = {
								name: individualJob.name,
								url: individualJob.url,
								build_status: data.building,
							};

							jenkinsJobs.push(jenkinsSummary);

							//console.log(`\n\n${individualJob.name}\n${individualJob.url}\nBuilding status: ${data.building}\n\n`);
						});
					}
					if (count == data.length) {
						resolve(jenkinsJobs);
					}
				});
			});
		});
	}

	var api = {
		getDirectories: getDirectories,
		getFolderNames: getFolderNames,
		getGivenFileDirectory: getGivenFileDirectory,
		getGivenAmountOfDays: getGivenAmountOfDays,
		returnValidHourFolders: returnValidHourFolders,
		getLatestTestResult: getLatestTestResult,
		getDataContents: getDataContents,
		sortEnvironmentFolders: sortEnvironmentFolders,
		getLatestFeatureResultsForSlack: getLatestFeatureResultsForSlack,
		getLatestResultForGivenFeatureName: getLatestResultForGivenFeatureName,
		getJenkinsJobs: getJenkinsJobs,
		getBasenames: getBasenames,
	};

	module.exports = api;
})();
