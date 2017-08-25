//Global Constants
var ValidationSheetApp = SpreadsheetApp.openById("1zQMN_t94oS55TwO5kI7p-QRkJti0dRwvGwEuGqkxMY4");
var DataSheetApp = SpreadsheetApp.openById("1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I");
var ValidationSheet = DataSheetApp.getSheetByName("Series Form Submissions");
var HistorySheet = ValidationSheetApp.getSheetByName("Series History");
var WebHook = ValidationSheetApp.getSheetByName("Webhook Triggers");

