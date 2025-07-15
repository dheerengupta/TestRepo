# Google AdSense Setup Guide for Your Meditation Website

## 🎯 Ad Spaces Already Added

Your meditation website now includes **5 strategic ad spaces** that integrate seamlessly with the peaceful design:

### 📍 Ad Locations:

1. **Top Banner Ad** (728x90) - Below header
2. **Mid-Content Rectangle Ad** (300x250) - Between timer and progress sections  
3. **Sidebar Skyscraper Ad** (160x600) - Right sidebar
4. **Sidebar Rectangle Ad** (300x250) - Right sidebar, below skyscraper
5. **Bottom Banner Ad** (728x90) - Above footer

---

## 🚀 How to Set Up Google AdSense

### Step 1: Create Google AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website URL: `https://dheerengupta.github.io/TestRepo/`
4. Select your country/region
5. Choose payment currency

### Step 2: Add AdSense Code to Your Site
1. **Get your AdSense code** from the AdSense dashboard
2. **Add the auto ads code** to the `<head>` section of `index.html`
3. **Wait for approval** (usually 1-14 days)

### Step 3: Replace Ad Placeholders
Once approved, replace the placeholder `<div class="ad-content">Advertisement</div>` with your actual AdSense code in these locations:

---

## 📝 Implementation Instructions

### 1. Top Banner Ad (728x90)
**Location:** Line ~32 in `index.html`
```html
<!-- REPLACE THIS -->
<div class="ad-content">Advertisement</div>

<!-- WITH YOUR ADSENSE CODE -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 2. Mid-Content Rectangle Ad (300x250)
**Location:** Line ~67 in `index.html`
```html
<!-- Use same format as above but with appropriate ad unit -->
```

### 3. Sidebar Ads
**Location:** Lines ~99 and ~107 in `index.html`
```html
<!-- Replace both sidebar ad placeholders with your AdSense code -->
```

### 4. Bottom Banner Ad (728x90)
**Location:** Line ~118 in `index.html`
```html
<!-- Replace with your AdSense code -->
```

---

## 📱 Responsive Design

The ad spaces are fully responsive:
- **Desktop:** Shows all ad formats
- **Tablet:** Stacks sidebar below main content
- **Mobile:** Hides skyscraper ads, shows mobile-optimized banners (320x50)

---

## 💡 Best Practices

### Content Guidelines
- **Keep content family-friendly** for better ad rates
- **Avoid clickbait** - focus on genuine meditation value
- **Regular updates** - add new meditations periodically

### Performance Tips
- **Don't click your own ads** (violates AdSense policy)
- **Don't ask others to click** ads
- **Monitor performance** in AdSense dashboard
- **A/B test** different ad placements

### Revenue Optimization
- **Target keywords:** meditation, mindfulness, wellness, stress relief
- **Quality content** = higher ad rates
- **Mobile optimization** = more traffic
- **User engagement** = better ad performance

---

## 🔧 Technical Implementation

### Add Auto Ads Code
Add this to the `<head>` section of `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

### Manual Ad Units
For each ad space, use this format:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

## 📊 Expected Revenue

### Factors Affecting Revenue:
- **Traffic volume** - More visitors = more revenue
- **Geographic location** - Some countries pay more
- **Content quality** - Better content = higher CPM
- **User engagement** - Longer sessions = more ad views

### Typical Earnings:
- **Small sites:** $1-10/month
- **Medium sites:** $10-100/month  
- **Large sites:** $100+/month

---

## 🚨 Important Notes

1. **AdSense Approval:** Your site needs good content and traffic
2. **Policy Compliance:** Follow Google's content policies
3. **Mobile-First:** Ensure ads work well on mobile devices
4. **User Experience:** Don't overwhelm users with too many ads
5. **Loading Speed:** Monitor that ads don't slow down your site

---

## 🎯 Next Steps

1. **Apply for AdSense** account
2. **Wait for approval** 
3. **Replace placeholders** with actual ad code
4. **Monitor performance** in AdSense dashboard
5. **Optimize** based on results

---

**Your meditation website is now AdSense-ready!** 🧘‍♀️💰

The ad spaces are strategically placed to generate revenue while maintaining the peaceful, meditative user experience.