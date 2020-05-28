<template>
  <div class="Home">
    <img class="d-block w-100" id="main" src="https://upload.wikimedia.org/wikipedia/commons/c/c4/Ukiyo-e_woodblock_print_by_Katsushika_Hokusai%2C_digitally_enhanced_by_rawpixel-com_19.jpg" alt="First slide" />
    <div class="container-fluid pt-4 px-4 overlap">
    <div class="row">
        <div class="col-xl-1"></div>
        <div class="col-xl">
            <h1 class="my-4">Nikki 日記</h1>
            <p class="my-3"> Welcome to Nikki, a website for language learning and language exchange. This website was inspired by Twitter and HelloTalk, as users can post in the languages they are learning and interact with native speakers. So far, Nikki has become a
                semi-blog style website, where users can log in, post content, like other posts, and make comments. This is still a work in progress, so I'd like to add some extra features, such as letting users upload profile pictures and have followers.
                </p>
            <p class="my-3">You can view my Nikki profile <a href="/users/shen.ed">here</a> to get a better idea of what Nikki is and how it works.</p>
            <h2 class="my-4">Purpose and philosophy</h2>
            <p class="my-3">My goal is to help all language learners, from children in preschool to the elderly, apply their language skills. It is all too easy to drown in the endless number of grammar points from textbooks, and even easier to forget them. Thus, I made
                Nikki so users can actually apply their knowledge and keep a journal of their progress. I hope they will find this a motivating way to continue their language learning journies, and perhaps make a couple of friends on the way! </p>
            <p class="my-3">Unlike Twitter, Nikki does not have a word limit on each post, so users can write paragraphs as long as they want. In this regard, it is more like a blog than a social media platform. Furthermore, I wanted to make a desktop version of something
                similar to Hellotalk, which is mobile only. For now, users cannot directly edit/make suggestions on other users' blog posts, but I hope to add this feature soon. I also hope that comments will serve as that purpose as I work to implement
                more language learning features.</p>
            <h2 class="my-4">Getting the most out of Nikki</h2>
            <p class="my-3">Since this website was made primarily for Japanese learners (though it supports any language), if you are learning Japanese, I suggest you read Nikki blog posts with <a href="https://chrome.google.com/webstore/detail/yomichan/ogmnaimimemjmbakcfefmnahgdfhfami?hl=en-US">Yomichan</a>.
                Yomichan is a Google Extension that works great with Anki, so you can easily create kanji flashcards and add kanji you have never seen before or forgotten.</p>
            <p class="my-3">I also encourage you to write posts that are challenging to express in your target language. It will help your language skills greatly and boost your confidence! For even more value, have a native speaker read, correct, or comment on your
                posts. If you need help finding Japanese or English native speakers, please check out my <a href="https://discord.gg/wukf9dQ">Discord Server</a>. </p>
        </div>
        <div class="col-xl">
            <h2 class="my-4">Technologies</h2>
            <p class="my-3">Nikki uses Vue.js, Passport.js, Bootstrap, MongoDB, and was designed RESTfully. I have yet to complete the REST API and implement API keys/tokens, but users can access their <a href="/users/shen.ed/json">JSON data</a> and also their <a href="/users/shen.ed/posts">post data</a>,
                which are structured like Twitter's user and tweet objects. For more information, please check out my <a href="https://github.com/edshen17/nikki">Github repository</a>. </p>
                <img class="w-100 welcome" src="../assets/img/image0.jpg" alt="Welcome"/>
            <h5 class="center mb-5">Drawn by Yui Nomura (野村柚衣)</h5>
        </div>
        <div class="col-xl-1"></div>
    </div>
  </div>
  <footer class="pt-2 footer mx-3">
   &copy; Edwin Shen
  </footer>
</div>
</template>

<script>
import LayoutDefault from './layouts/LayoutDefault';

export default {
  name: 'Home',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
};
</script>
