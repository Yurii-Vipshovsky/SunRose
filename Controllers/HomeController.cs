using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.Linq;
using System.Net;
using TestTask.Models;

namespace TestTask.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private static readonly List<Message> messages = new List<Message>();

        private const int MAX_MESSAGES_PER_USER = 10;
        private const int MAX_MESSAGES = 20;

        //save user Id and number of posted messages
        private static readonly Dictionary<string, int> messagesPerUser = new Dictionary<string, int>();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            string userToken = Guid.NewGuid().ToString();
            messagesPerUser[userToken] = 0;
            Response.Cookies.Append("UserToken", userToken);
            return View();
        }

        [HttpPost]
        public IActionResult SendMessage(string text, string userToken)
        {
            if (!string.IsNullOrEmpty(text))
            {
                Message message = new Message();
                message.Id = Guid.NewGuid().ToString();
                message.Text = text;
                message.UserId = userToken;
                message.Timestamp = DateTime.UtcNow;
                if (messagesPerUser[userToken] == MAX_MESSAGES_PER_USER)
                {
                    //delete first message of curent user
                    Message toDelete = messages.First(message => message.UserId == userToken);
                    messages.Remove(toDelete);
                    messagesPerUser[userToken] -= 1;
                }
                if (messages.Count == MAX_MESSAGES)
                {
                    //delete first element to have least then 20 messages of all users
                    messages.RemoveAt(0);
                }
                messagesPerUser[userToken] += 1;
                messages.Add(message);
                return StatusCode(200);
            }
            return StatusCode(400);            
        }

        [HttpGet]
        public IActionResult ShowCurentUserMessages(string userToken)
        {
            return Json(messages.Where(message => message.UserId == userToken).ToArray());

        }

        [HttpGet]
        public IActionResult ShowAllUsersMessages(string sortBy, string order)
        {
            if (sortBy == "time") {
                if (order == "acs")
                {
                    return Json(messages.OrderBy(message => message.Timestamp).ToArray());
                }
                else
                {
                    return Json(messages.OrderByDescending(message => message.Timestamp).ToArray());
                }
            }
            else
            {
                if (order == "acs")
                {
                    return Json(messages.OrderBy(message => message.Id).ToArray());
                }
                else
                {
                    return Json(messages.OrderByDescending(message => message.Id).ToArray());
                }
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}