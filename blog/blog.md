# Calculating Price Efficiency of Virtualized Workloads

### **No one wants to pay extra, especially when reducing cost can be as simple as a few clicks.**

Most of the modern web is hosted in the cloud, on virtual machines (VMs).
This allows these workloads to be quickly and easily moved from one server to another,
or even from one data center to another.
A website for a small business might only need a tiny slice of a server, while a video streaming service needs
multiple aisles of servers.
All this flexibility makes it hard to know if you're getting the best deal for your workload.

**A few simple tools and some public data can help you save 30%-90% on your workloads**

![Banner]()

## How to Find Discounts

To find the best deals on cloud VMs, we need to compare the different server families available,
and see which ones offer the best performance for the price.

### **What is a server family?**

Over the past decade, cloud providers have released multiple generations of servers,
each with different hardware and performance characteristics.
The prices vary, but not always in a way that reflects the performance.

**By comparing expected performance to price, we can find often overlooked hardware.**

As faster and more powerful hardware is released,
there's a tendency for the market to shift towards the latest and greatest,
leaving the older hardware underutilized.

### **How to compare server families?**

The most straightforward way to compare server families is to look at the benchmark scores for each VM compared to it's
price.
Then, by filtering out the VMs that don't meet your needs, you can quickly narrow down to a few families that are the
most cost-effective for your workload.

### **Spot Instance Discounts**

When a hardware family is underutilized, cloud providers often offer discounts to fill the capacity.
These discounts can be as high as 90% off the regular price, making it a great option for workloads that can handle
interruptions,
But the catch is that these VMs can be interrupted at any time if the hardware is requested by a higher-paying customer.
**If your workload can handle interruptions, this can be a great way to save money.**
Most cloud providers offer a way to request spot instances, and will notify you when your instance is about to be interrupted.
They will also often offer a way to automatically migrate that instance to a different hardware family or region.

### Regional Discounts

Cloud providers often have different prices, especially spot prices, for the same hardware in different regions.
If your workload isn't tied to a specific region, you can often find significant savings by taking advantage of these
regional differences.

### Benchmarking

A number of synthetic benchmarks are available to compare the performance of different hardware families.
These benchmarks put the hardware through a series of tests like calculating pi, sorting large datasets, and encrypting
data.
Your workload will likely have different performance characteristics than the benchmark across different hardware
families,
so it's important to gather your own performance data to see how the hardware performs for your specific workload.

We at Tenasol began by running our own benchmarks on the 5 hardware families that scored the best with the public
benchmarks,
and then verified how well they correlated with the public benchmarks.
This allowed us to quickly narrow down the number of families that we needed to test for our specific workload.

## Analysis

To help you follow the same process, we at Tenasol developed a public webapp that allows you to
compare the price of different server families in the GCP cloud, using public benchmark data.

This allows you to quickly find a starting point for your see which server families might be most cost-effective for your workload,
and in which regions.
The filters below the chart allow you to filter out vms that don't meet your needs, 
and the chart allows you to see which families offer the best performance for the price.

A separate chart allows you to compare the spot performance to the standard performance, to see which families offer the best discounts.

![Webapp]()

## Conclusion
By using the tools and techniques outlined in this blog post, you can quickly and easily find the best deals on cloud VMs for your workload.
This can save you 30%-90% on your cloud costs, allowing you to focus on what matters most: growing your business.
### **Try it out for yourself!**
[PricingCalculator](https://pricingcalculator.tenasol.com)
