using System;
using System.Collections.Generic;
using Dapper;
using Microsoft.Data.SqlClient;
using Vinlotterix_Simple_Backend;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
var connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=VinlotterixSimple;";
var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
app.UseStaticFiles();

app.MapDelete("/participants/{id}", (int id) =>
{
    var connection = new SqlConnection(connectionString);
    return connection.ExecuteAsync("DELETE FROM dbo.Participant WHERE id = @id;", new { id });
});

app.MapGet("/participants", () =>
{
    var connection = new SqlConnection(connectionString);
    return connection.QueryAsync<Person>("SELECT * FROM dbo.Participant;");
});


app.MapGet("/participants/{id}", (int id) =>
{
    var connection = new SqlConnection(connectionString);
    return connection.QueryFirstOrDefaultAsync<Person>("SELECT * FROM dbo.Participant WHERE id = @id;", new { id });
});

app.MapPost("/participants", (Person person) =>
{
    var connection = new SqlConnection(connectionString);
    return connection.ExecuteAsync("INSERT INTO dbo.Participant (name) VALUES(@name);", new { person.Name });
});

app.MapGet("/winners", () =>
{
    var connection = new SqlConnection(connectionString);
    var results = connection.QueryAsync<DrawResultModel>("SELECT * FROM dbo.DrawResult;").Result.ToList();

    var drawResults = new List<DrawResult>();

    results.ForEach(result =>
    {
        drawResults.Add(new DrawResult
        {
            Participants = result.Participants.Trim().Split(' '),
            Time = result.Time,
            Winners = result.Winners.Trim().Split(' ')
        });
    });

    return drawResults;
});

app.MapPost("/draw", (DrawViewModel draw) =>
{
    var connection = new SqlConnection(connectionString);
    var random = new Random();
    var ids = draw.Ids.ToList();

    var participantList = new List<Person>();

    foreach (var id in ids)
    {
        var person = connection.QueryFirstOrDefaultAsync<Person>("SELECT * FROM dbo.Participant WHERE id = @id;", new { id  }).Result;
        participantList.Add(person);
    }
    var participants = participantList.Aggregate("", (a, b) => $"{a}{b.Name} ");

    var winners = "";
    while (draw.Count-- > 0 && ids.Count > 0)
    {
        var randomIndex = random.Next(ids.Count);
        winners += participantList.Find(p => p.Id == ids[randomIndex])?.Name + " ";
        ids.RemoveAt(randomIndex);
    }

    const string query = @"INSERT INTO dbo.DrawResult (winners, time, participants) VALUES(@winners, @time, @participants);";
    return connection.ExecuteAsync(query, new { winners, time = DateTime.Now, participants });
});

app.Run();