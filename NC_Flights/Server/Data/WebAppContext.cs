using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NC_Flights.Shared;

namespace NC_Flights.Server.Data;

public partial class WebAppContext : DbContext
{
    public WebAppContext()
    {
    }

    public WebAppContext(DbContextOptions<WebAppContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Airline> Airlines { get; set; }

    public virtual DbSet<AirlinesNc> AirlinesNcs { get; set; }

    public virtual DbSet<AuthCredential> AuthCredentials { get; set; }

    public virtual DbSet<TestDatum> TestData { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Airline>(entity =>
        {
            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Airline1)
                .HasMaxLength(50)
                .HasColumnName("Airline");
            entity.Property(e => e.AirportFrom).HasMaxLength(50);
            entity.Property(e => e.AirportTo).HasMaxLength(50);
        });

        modelBuilder.Entity<AirlinesNc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Airlines__3213E83F993BD1C4");

            entity.ToTable("AirlinesNC");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Airline).HasMaxLength(50);
            entity.Property(e => e.AirportFrom).HasMaxLength(50);
            entity.Property(e => e.AirportTo).HasMaxLength(50);
        });

        modelBuilder.Entity<AuthCredential>(entity =>
        {
            entity.HasKey(e => e.Username);

            entity.Property(e => e.Username)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("username");
            entity.Property(e => e.Password)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("password");
        });

        modelBuilder.Entity<TestDatum>(entity =>
        {
            entity.HasKey(e => e.Name);

            entity.ToTable(tb => tb.HasComment("This is a test table for VS Web App .NET"));

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Age)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.LastChangeDate)
                .HasColumnType("date")
                .HasColumnName("Last_Change_Date");
            entity.Property(e => e.Role)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
